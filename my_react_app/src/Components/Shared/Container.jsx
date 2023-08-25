const Container = ({ children }) => {
    return (
        <div className="min-h-screen overflow-y-auto mx-auto pt-10 pb-2 px-2 md:px-10 xl:px-20">
            {children}
        </div>
    )
}
export default Container
