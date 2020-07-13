import React, { createPortal } from 'react'
import Toast from './Toast'
// const Wrapper = styled.div`
//   position: absolute;
//   /* Top right corner */
//   right: 0;
//   top: 0;
// `;

const ToastContainer = ({ toasts }) => {
  return createPortal(
    <div>
      {toasts.map(item => {
        return <Toast key={item.id} id={item.id}>{item.content}</Toast>
      })}

    </div>,
    document.body
  )
}

export default ToastContainer
