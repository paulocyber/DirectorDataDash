import React from 'react'

const Loading = () => {
    return (
        <div className="flex items-center justify-center flex-col">
            <div
                style={{ borderTopColor: "transparent" }}
                className="w-8 h-8 border-4 border-blue-500 rounded-full animate-spin"
            ></div>
            <p className="ml-2 pt-2 text-sm">Carregando...</p>
        </div>
    )
}

export default Loading