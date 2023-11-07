import { useRouter } from 'next/router'
import Home from "./index"
 
export default function userChats() {
  const router = useRouter()
  const userId = router.query.slug
  
  return <Home userId={userId}/>
}