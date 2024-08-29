
import { auth } from "@/server/auth"
import { redirect } from "next/navigation"
import SettingCard from "./setting-card";


const Settings = async () => {
  
  const session = await auth();   

  // if user not login redirect to home page
  if (!session) redirect('/');

  if (session) return <SettingCard session={session}/>
  

}

export default Settings