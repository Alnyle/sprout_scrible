'use client';


import { Session } from 'next-auth';
import { signOut } from 'next-auth/react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from 'next/image';


import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut, Moon, Settings, Sun, TruckIcon } from 'lucide-react';
import { FaSignOutAlt } from 'react-icons/fa';
import { useTheme } from 'next-themes';
import { useState } from 'react';
import { Switch } from "@/components/ui/switch"
import { useRouter } from 'next/navigation';


const UserButton = ({ user }: Session) => {


  const {theme, setTheme } = useTheme();
  const [checked, setChecked] = useState(false);
  const router = useRouter();

  function setSwitchState() {
    if (theme) {
      switch(theme){
        case "dark": 
          return setChecked(true);
        case "light":
          return setChecked(false);
        case "system":
          return setChecked(false);
      }
    }
  }


  function handleChangeTheme(e: any) {
    setChecked((prev) => !prev)
    if (e) setTheme("dark")
    if (!e) setTheme("light")
  }

  if (user)
    return (
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger>
          <Avatar>
            {user.image && (
              <Image 
                src={user.image}
                alt={user.name!}
                fill={true}
                className='rounded-full'
              />      
            )}
            {!user.image && 
              (<AvatarFallback className='bg-primary/25'>
                <div className='font-bold'>
                  {user.name?.charAt(0).toUpperCase()}
                </div>
              </AvatarFallback>)}
          </Avatar>
    
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-64 p-6' align='end'>
          <div className='flex flex-col gap-1 items-center p-6 bg-secondary/50 rounded-lg'>
            {user.image ? (
              <Image 
                src={user.image}
                alt={user.name!}
                width={36}
                height={36}
                className='rounded-full'
              />              
            ) : (
                <div className='font-bold h-12 w-12 rounded-full bg-primary/25 flex justify-center items-center'>
                  <p>{user.name?.charAt(0).toUpperCase()}</p>
                </div>
            )}
            <p className='font-bold text-xs'>{user.name}</p>
            <span className='text-xs font-medium text-secondary-foreground'>{user.email}</span>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => router.push('/dashboard/orders')} className="group py-2 font-medium cursor-pointer">
            <TruckIcon size={14} className='mr-3 group-hover:translate-x-1 transition-all duration-300 ease-in-out'/>  
            My orders
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push('/dashboard/settings')} className="group py-2 font-medium cursor-pointer transition-all  duration-500">
           <Settings size={14} className='mr-3 group-hover:rotate-180 transition-all duration-300 ease-in-out' /> 
            Settings
          </DropdownMenuItem>

          {theme ? (
              <DropdownMenuItem className="py-2 font-medium cursor-pointer ease-in-out">
              <div onClick={(e) => e.stopPropagation()} className='flex items-center group'>
                <div className='relative flex mr-3'>
                  <Sun className='group-hover:text-yellow-600 group-hover:rotate-180 absolute dark:scale-0 dark:-rotate-90 transition-all duration-500 ease-in-out' size={14}/>
                  <Moon className='group-hover:text-blue-400 group-hover:rotate-180 dark:scale-100 scale-0 transition-all duration-500 ease-in-out'  size={14}/>
                </div>     
              </div>
              <p className='dark:text-blue-400 text-secondary-foreground/75 text-yellow-600'>
                {theme[0].toUpperCase() + theme?.slice(1)} Mode
              </p>
              <Switch className='scale-75' checked={checked} onCheckedChange={handleChangeTheme}/>

            </DropdownMenuItem>
          ): null}

          <DropdownMenuItem
            onClick={() => signOut()}
            className='py-2 focus:bg-destructive/30 group front-medium cursor-pointer'
          >
            <LogOut size={14} className='mr-3 group-hover:scale-75 transition-all duration-300 ease-in-out'/> Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
  )
}

export default UserButton