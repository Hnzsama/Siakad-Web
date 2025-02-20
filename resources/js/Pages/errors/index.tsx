import ForbiddenError from "./components/forbidden"
import GeneralError from "./components/general-error"
import MaintenanceError from "./components/maintenance-error"
import NotFoundError from "./components/not-found-error"
import UnauthorisedError from "./components/unauthorized-error"

interface Props {
    status: number
}

export default function ErrorPage({ status }: Props) {
    const getErrorComponent = () => {
        switch (status) {
            case 503:
                return <MaintenanceError />
            case 500:
                return <GeneralError />
            case 404:
                return <NotFoundError />
            case 403:
                return <ForbiddenError />
            case 401:
                return <UnauthorisedError />
            default:
                return <GeneralError />
        }
    }

    console.log(status)

    return getErrorComponent()
}
