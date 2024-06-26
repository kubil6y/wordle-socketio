type BoardProps = {
    width: number;
    height: number;
};

export const Board = ({ width, height }: BoardProps) => {
    return null;
};

type RowProps = {
    width: number;
}

const Row = ({ width }: RowProps) => { 
    return null;
};

type BoxProps = {
}

// border light: #d3d6da
// border dark: #818384
const Box = ({}: BoxProps) => { 
    return (
        <div className="">

        </div>
    )
};
