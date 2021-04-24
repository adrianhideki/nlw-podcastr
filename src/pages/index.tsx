import { useEffect } from "react";
import { Header } from "../components/Header";

export default function Home(props) {
  //SPA
  // useEffect(() => {
  //   fetch('http://localhost:3333/episodes')
  //   .then(response => response.json())
  //   .then(json => console.log(json));
  // }, []);

  return (
    <div>
      <h1>index</h1>
      <p>
        {JSON.stringify(props.episodes)}
      </p>
    </div>
  );
}

//SSR
// export async function getServerSideProps() {
//   const respose = await fetch("http://localhost:3333/episodes");
//   const data = await respose.json();

//   return {
//     props: {
//       episodes: data,
//     },
//   };
// }

//SSG
export async function getStaticProps() {
  const respose = await fetch("http://localhost:3333/episodes");
  const data = await respose.json();

  return {
    props: {
      episodes: data,
    },
    revalidate: 60 * 60 * 8,
  };
}
