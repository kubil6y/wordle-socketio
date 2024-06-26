type BoardProps = {
    width: number;
    height: number;
};

export const Board = ({ width, height }: BoardProps) => {
    return (
        null
    );
};

type CellProps = {
    ch?: string;
    hiGreen: boolean;
    hiYellow: boolean;
    hiNotFound: boolean;
}

// 52px,60px
const Cell = ({ch}: CellProps) => { 
    return (
        <div className="size-[52px] sm:[60px] flex select-none items-center justify-center border-[2px]">
            {ch}
        </div>
    )
};
