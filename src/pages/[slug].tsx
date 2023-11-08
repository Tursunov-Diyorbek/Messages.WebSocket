import { useRouter } from 'next/router'
import Home from "./index"
 
export default function userChats() {
  const router = useRouter()
  const _id = router.query.slug
  
  return <Home _id={_id}/>
}