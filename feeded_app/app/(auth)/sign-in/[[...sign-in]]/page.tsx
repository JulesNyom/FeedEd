import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return <SignIn appearance={{
    elements: {
      rootbox : 'bg-slate-500 hover:bg-slate-400 text-sm',
    },
    variables: {
      colorPrimary: '#6238F1',
      colorText: 'black',
    },
  }} />
}