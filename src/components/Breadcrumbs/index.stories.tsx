import React from "react";

import Breadcrumbs from ".";

export default {
  title: "components/Breadcrumbs",
};

export const FileInRootDirectory = () => <Breadcrumbs path="hello.js" />;

export const FileInDirectory = () => <Breadcrumbs path="src/components/Breadcrumbs/index.stories.tsx" />;
