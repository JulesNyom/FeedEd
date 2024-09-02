import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return <SignIn appearance={{
    elements: {
      logoImage: 'size-48 mb-5',
      headerTitle: 'text-3xl font-thin',
      headerSubtitle: 'text-xs text-lightgray',
      header: '',
      formButtonPrimary: 'text-lg',
      rootBox : 'bg-white hover:bg-slate-400 text-sm',
      cardBox: 'bg-white shadow-none border-none ',
      card: 'bg-white shadow-none border-none',
      footer: 'bg-white border-none',
      footerAction_signIn: 'bg-white border-none',
      footerAction: 'bg-white border-none',
    },
    variables: {
      colorPrimary: '#6238F1',
      colorText: 'black',
    },
  }} />
}