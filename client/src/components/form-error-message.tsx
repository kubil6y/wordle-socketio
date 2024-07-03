export const FormErrorMessage = ({message}: { message: string }) => {
    return (
        <p className="text-destructive text-sm font-semibold">
            {message}
        </p>
    )
}
