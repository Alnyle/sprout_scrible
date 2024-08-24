
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Socials from "@/components/auth/soicals";
import BackButton from "@/components/auth/back-button";

type CardWrapperProps = {
    children: React.ReactNode,
    cardTitle: string,
    backButtonHref: string,
    backButtonLabel: string,
    showSocial: boolean,
}

const AuthCard = ({
    children,
    cardTitle,
    backButtonHref,
    backButtonLabel,
    showSocial
}: CardWrapperProps) => {
  return (
    <div>
        <Card>
            <CardHeader>
                <CardTitle>{cardTitle}</CardTitle>
            </CardHeader>
            <CardContent>{children}</CardContent>
            {showSocial && (
                <CardFooter>
                    <Socials/>
                </CardFooter>
            )}
            <CardFooter>
                <BackButton href={backButtonHref} label={backButtonLabel}/>
            </CardFooter>
        </Card>
    </div>
  )
}

export default AuthCard;