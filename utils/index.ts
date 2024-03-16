
export const CreateError = (code: number, message: string,) => {
    const error = new Error() as any;
    error.message = message;
    error.statusCode = code;
    return error;
}






export const getIp = (req: any) => {
    // get client ip address
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    return ip;
}

export const formatDate = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    };

    const formattedDate: string = new Intl.DateTimeFormat('en-US', options).format(date);

    return formattedDate;
}

export const getUserIPAddress = async () => {

};
