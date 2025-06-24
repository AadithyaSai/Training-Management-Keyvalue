const FormInput = ({
    name,
    label,
    type = "text",
    value = "",
    onChange
}: {
    name: string;
    label: string;
    type?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}) => {
    return (
        <div className="flex flex-col w-full gap-6">
            <label htmlFor={name} className="text-white text-lg">
                {label}
            </label>
            {type === "textarea" ? (
                <textarea
                    name={name}
                    rows={5}
                    placeholder={label}
                    value={value}
                    onChange={onChange}
                    className="text-white rounded bg-itemColor p-4"
                />
            ) : (
                <input
                    name={name}
                    type={type}
                    placeholder={label}
                    value={value}
                    onChange={onChange}
                    className="text-white rounded bg-itemColor p-4"
                />
            )}
        </div>
    );
};

export default FormInput;
