import { Helmet } from "react-helmet-async";
import { Language, useWordle } from "@/hooks/use-wordle";
import { useEffect, useState } from "react";

export const HtmlLanguageMatcher = () => {
    const { language } = useWordle();
    const [htmlLanguage, setHtmlLanguage] = useState<Language>(language);

    useEffect(() => {
        setHtmlLanguage(language);
    }, [language]);

    return (
        <div>
            <Helmet>
                <html lang={htmlLanguage} />
            </Helmet>
        </div>
    );
};
