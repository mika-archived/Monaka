import React from "react";

import { FileType } from "@/types";

type Props = {
  languages: FileType[];
};

const LanguageContext = React.createContext([] as FileType[]);

const LanguageProvider: React.FC<Props> = ({ children, languages }) => {
  return <LanguageContext.Provider value={languages}>{children}</LanguageContext.Provider>;
};

export default LanguageProvider;
export { LanguageContext };
