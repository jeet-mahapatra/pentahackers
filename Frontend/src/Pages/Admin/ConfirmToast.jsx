const ConfirmToast = ({ message, onConfirm, closeToast }) => (
    <div className="font-['serif'] text-xs backdrop:blur-lg bg-slate-900/80 rounded-lg p-4 border border-slate-700 shadow-lg">
        <p className="mb-3 font-bold text-slate-200">{message}</p>
        <div className="flex gap-2 justify-end">
            <button onClick={closeToast} className="px-3 py-1 bg-slate-700 rounded text-white font-bold">
                Cancel
            </button>
            <button onClick={() => { onConfirm(); closeToast(); }} className="px-3 py-1 bg-teal-500 rounded text-slate-900 font-black">
                Confirm
            </button>
        </div>
    </div>
);

export default ConfirmToast;