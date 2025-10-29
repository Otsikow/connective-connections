import { useEffect } from "react";

const BASE_TITLE = "Connective Connections";

export const usePageTitle = (title?: string) => {
  useEffect(() => {
    if (title && title.trim().length > 0) {
      document.title = `${title} | ${BASE_TITLE}`;
    } else {
      document.title = BASE_TITLE;
    }

    return () => {
      document.title = BASE_TITLE;
    };
  }, [title]);
};
