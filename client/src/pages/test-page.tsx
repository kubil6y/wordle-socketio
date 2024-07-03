import { AvatarSelection } from "@/components/avatar-selection";
import { useState } from "react";

const defaultAvatar = "avatar1";

export const TestPage = () => {
    const [avatar, setAvatar] = useState<string>(defaultAvatar);

    function onSelect(avatar: string): void {
        setAvatar(avatar);
    }

    return (
        <div className="container">
            <AvatarSelection selectedAvatar={avatar} onSelect={onSelect} />
        </div>
    );
};
