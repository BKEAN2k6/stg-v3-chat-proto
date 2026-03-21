import {type ReactNode} from 'react';

type Props = {
  readonly returnPath: string;
  readonly children: ReactNode;
};

export function FullScreenModal(props: Props) {
  const {children} = props;
  return children;
}

// BEFORE:

// "use client"

// import { ReactNode, useEffect, useState } from "react"

// import { Dialog, DialogContent } from "@/components/atomic/atoms/RouteDialog"

// interface Props {
//   returnPath: string
//   animate?: boolean
//   children: ReactNode
// }

// export function FullScreenModal(props: Props) {
//   const { returnPath, children, animate = true } = props
//   const [dialogIsOpen, setDialogIsOpen] = useState(false)

//   useEffect(() => {
//     setDialogIsOpen(true)
//   }, [])

//   return (
//     <>
//       {children}
//       <Dialog open={dialogIsOpen}>
//         <DialogContent
//           animate={animate}
//           returnPath={returnPath}
//           className="safe-h-screen-padded w-[calc(100vw_-_20px)] max-w-full overflow-hidden md:w-[calc(100vw_-_20px)]"
//         >
//           {children}
//         </DialogContent>
//       </Dialog>
//     </>
//   )
// }
