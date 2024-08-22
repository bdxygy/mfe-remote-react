import React, { lazy, Suspense } from "react";
import "./App.scss";
import { Route, Routes } from "react-router-dom";

const Navbar = lazy(() => import("./components/Navbar/Navbar"));
const About = lazy(() => import("./components/About/About"));
const Home = lazy(() => import("./components/Home/Home"));

export default function App() {
  return (
    <Suspense fallback={<h1>Loading...</h1>}>
      <Navbar />
      <Routes>
        <Route path="/" Component={Home} />
        <Route path="/about" Component={About} />
      </Routes>
    </Suspense>
  );
}
