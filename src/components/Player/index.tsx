import { useRef, useEffect, useState } from "react";
import { usePlayer } from "../../contexts/PlayerContext";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import styles from "./styles.module.scss";
import Image from "next/image";
import { convertDurationToTimeString } from "../../utils/convertDurationToTimeString";

export function Player() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [progress, setProgress] = useState(0);

  const {
    episodeList,
    currentEpisodeIndex,
    isPlaying,
    hasNext,
    hasPrevious,
    togglePlay,
    toggleLoop,
    setIsPlayingState,
    playNext,
    playPrevious,
    isLooping,
    isShuffling,
    toggleShuffle,
    clearPlayerState
  } = usePlayer();

  const episode = episodeList[currentEpisodeIndex];

  useEffect(() => {
    if (!audioRef.current) {
      return;
    }

    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  function setupProgressListener(){
    audioRef.current.currentTime = 0;
    audioRef.current.addEventListener('timeupdate', () => {
      setProgress(audioRef.current.currentTime);
    })
  }

  function handleSeek(amout: number) {
    audioRef.current.currentTime = amout;
    setProgress(amout);
  }

  function handleEpisodeEnded(){
    if(hasNext) {
      playNext();
    } else {
      clearPlayerState();
    }
  }

  return (
    <div className={styles.playerContainer}>
      <header>
        <img src="/playing.svg" alt="Tocando agora" />
        <strong>Tocando agora</strong>
      </header>
      {episode ? (
        <div className={styles.currentEpisode}>
          <Image
            width={592}
            height={592}
            src={episode.thumbnail}
            objectFit="cover"
          />
          <strong>{episode.title}</strong>
          <span>{episode.members}</span>
        </div>
      ) : (
        <div className={styles.emptyPlayerContainer}>
          <strong>Selecione um podcast para ouvir</strong>
        </div>
      )}

      <footer className={!episode ? styles.empty : ""}>
        <div className={styles.progress}>
          <span>{convertDurationToTimeString(progress)}</span>
          <div className={styles.slider}>
            {episode ? (
              <Slider
                onChange={handleSeek}
                max={episode.duration}
                value={progress}
                trackStyle={{ backgroundColor: "#04D361" }}
                railStyle={{ backgroundColor: "#9f75ff" }}
                handleStyle={{ borderColor: "#04D361", borderWidth: 4 }}
              />
            ) : (
              <div className={styles.emptySlider}></div>
            )}
          </div>
          <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
        </div>
        {episode && (
          <audio
            src={episode.url}
            autoPlay
            ref={audioRef}
            onPlay={() => setIsPlayingState(true)}
            onPause={() => setIsPlayingState(false)}
            onLoadedMetadata={setupProgressListener}
            loop={isLooping}
            onEnded={handleEpisodeEnded}
          />
        )}
        <div className={styles.buttons}>
          <button
            type="button"
            disabled={!episode || episodeList.length == 1}
            onClick={toggleShuffle}
            className={isShuffling ? styles.isActive : ""}
          >
            <img src="/shuffle.svg" alt="embaralhar" />
          </button>
          <button type="button" disabled={!episode || !hasPrevious}>
            <img
              src="/play-previous.svg"
              alt="tocar anterior"
              onClick={playPrevious}
            />
          </button>
          <button
            type="button"
            className={styles.playButton}
            disabled={!episode}
            onClick={togglePlay}
          >
            {isPlaying ? (
              <img src="/pause.svg" alt="tocar" />
            ) : (
              <img src="/play.svg" alt="tocar" />
            )}
          </button>
          <button type="button" disabled={!episode || !hasNext}>
            <img src="/play-next.svg" alt="tocar proxima" onClick={playNext} />
          </button>
          <button
            type="button"
            disabled={!episode}
            onClick={toggleLoop}
            className={isLooping ? styles.isActive : ""}
          >
            <img src="/repeat.svg" alt="repetir" />
          </button>
        </div>
      </footer>
    </div>
  );
}
