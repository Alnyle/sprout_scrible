import { AlertCircle } from "lucide-react";


const FormError = ({ message } : { message?: string }) => {

    if (!message) return null;

    return (
        <div className="bg-destructive/25 text-sm font-medium flex items-center gap-2 my-2 text-secondary-foreground p-3">
            <AlertCircle className="w-4 h-4"/>
            <p>{message}</p>
        </div>
    )

}

export default FormError;