type FormTitleProps = {
    title: string;
};

export const FormTitle = ({ title }: FormTitleProps) => {
    return <p className="text-2xl font-semibold">{title}</p>;
};
