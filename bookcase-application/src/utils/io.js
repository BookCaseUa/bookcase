function return_message(result, message, data = null) {
    if(result == "ERROR") console.error("[" + result + "] " + message)
    else console.log("[" + result + "] " + message)
    return {
        result: result,
        message: message,
        data: data
    }
}

export { return_message }