
interface OrbButtonProps {
    text: string
    primaryColor: string
    secondaryColor: string
    onClick: () => void
}

export function OrbButtonTsx({ text, primaryColor, secondaryColor, onClick }: OrbButtonProps) {
    const buttonStyle = {
        '--primary-color': secondaryColor,
        '--secondary-color': primaryColor,
    } as React.CSSProperties;

    return (
        <button 
            onClick={onClick}
            className={`
                group group-hover:before:duration-500 
                group-hover:after:duration-500 
                after:duration-500 duration-500 
                before:duration-500 hover:duration-500 
                underline underline-offset-2 
                hover:after:-right-24 hover:before:right-12 
                hover:before:-bottom-8 hover:before:blur 
                hover:underline hover:underline-offset-4 
                origin-left hover:decoration-2 
                relative bg-transparent h-16 w-64 
                border border-white text-left p-3 
                text-gray-50 text-base font-bold rounded-lg 
                overflow-hidden before:absolute before:w-12 
                before:h-12 before:content-[''] before:right-1 
                before:top-1 before:z-10 before:rounded-full 
                before:blur-lg after:absolute after:z-10 
                after:w-20 after:h-20 after:content-[''] 
                after:right-8 after:top-3 after:rounded-full 
                after:blur-lg
                hover:border-[var(--primary-color)]
                hover:before:[box-shadow:_20px_20px_20px_30px_var(--primary-color)]
                hover:text-[var(--primary-color)]
                before:bg-[var(--primary-color)]
                after:bg-[var(--secondary-color)]
            `}
            style={buttonStyle}
        >
            {text}
        </button>
    );
}