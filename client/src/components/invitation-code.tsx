import { CopyIcon } from "lucide-react";
import { FormTitle } from "./form-title";

type InvitationCodeProps = {
    code: string;
};

export function InvitationCode({
    code,
}: InvitationCodeProps) {
    function handleCopy() {
        navigator.clipboard.writeText(code);
    }
    return (
        <div className="space-y-2">
            <FormTitle title="Invitation Code" />

            <div className="flex items-center space-x-2 bg-gray-200 px-2 py-1">
                <input
                    type="text"
                    value={code}
                    readOnly
                    className="w-full border-none bg-gray-200 font-mono text-gray-900 focus:outline-none"
                    placeholder="ex: kubilay"
                />
                <button onClick={handleCopy} className="btn btn-icon">
                    <CopyIcon className="size-5 text-gray-900 transition active:text-primary-foreground/80" />
                </button>
            </div>
        </div>
    );
}
