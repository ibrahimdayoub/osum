import { toast } from "react-toastify";
import Modal from 'react-modal';
import { FaCheck, FaTimes } from "react-icons/fa";

export const toastify = (type, code, message) => {
    const toastOptions = {
        position: "top-right",
        autoClose: 1000,
        pauseOnHover: true,
        draggable: true,
        theme: localStorage.getItem("theme") === "light" ? "light" : "dark",
    };
    switch (type) {
        case "success":
            toast.success(
                /* "Code " + code + " | " + */message,
                toastOptions
            );
            break;
        case "info":
            toast.info(
                /* "Code " + code + " | " + */message,
                toastOptions
            );
            break;
        case "warn":
            toast.warn(
                /* "Code " + code + " | " + */message,
                toastOptions
            );
            break;
        case "error":
            toast.error(
                /* "Code " + code + " | " + */message,
                toastOptions
            );
            break;
        default:
            toast.dark(
                /* "Code " + code + " | " + */message,
                toastOptions
            );
            break;
    }
}

export const confirmModal = (openModal, setOpenModal, proccessName, action, actionParameter) => {
    const modalStyle = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            width: '360px',
            height: '120px',
            borderRadius: '8px',
            background: localStorage.getItem("theme") === "dark" ? "#121c2d" : "#f6f6f6",
            color: localStorage.getItem("theme") === "dark" ? "#f6f6f6" : "#121c2d",
            borderColor: localStorage.getItem("theme") === "dark" ? "#f6f6f6" : "#121c2d",
            borderWidth: '0.5px',
            padding: '0px',
            fontSize: '16px'
        }
    }
    const okSubmit = () => {
        action(actionParameter)
        setTimeout(() => {
            setOpenModal(false)
        }, 1000);
    }
    return (
        <Modal isOpen={openModal} style={modalStyle} >
            <div className="p-4">
                <p className="text-center text-lg px-4 mb-4">
                    {`Please confirm ${proccessName} proccess !`}
                </p>
                <div className="flex justify-around items-center">
                    <button onClick={() => setOpenModal(false)} className="text-sm rounded-md transition-all duration-500 shadow-dark/20 hover:opacity-75 bg-light/[0.075] shadow-inner border-dark/50 border-b-[3px] py-1 flex justify-center items-center w-24">
                        <FaTimes className="inline mr-1" />
                        Cancel
                    </button>
                    <button onClick={() => { okSubmit() }} className="text-sm rounded-md transition-all duration-500 shadow-dark/20 hover:opacity-75 bg-light/[0.075] shadow-inner border-dark/50 border-b-[3px] py-1 flex justify-center items-center w-24">
                        <FaCheck className="inline mr-1" />
                        Ok
                    </button>
                </div>
            </div>
        </Modal>
    )
}