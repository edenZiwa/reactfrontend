import React from "react";
import { PageIntro, AppLink } from "../components/SiteChrome.jsx";

function NotFound({ navigate }) {
  return (
    <PageIntro
      eyebrow="PAGE NOT FOUND"
      title={
        <>
          Let’s find the right <em>path.</em>
        </>
      }
      text={<>The page you are looking for may have moved. <AppLink to="/" navigate={navigate}>Return home</AppLink> or explore the foundation’s programs.</>}
    />
  );
}

export default NotFound;
