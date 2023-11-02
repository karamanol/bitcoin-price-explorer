import { AnimatePresence, motion } from "framer-motion";
import { ChangeEventHandler } from "react";

type InputProps = {
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  inputError: string;
};

function Input({ value, onChange, inputError }: InputProps) {
  return (
    <>
      <div className="flex justify-center items-center mt-8 ">
        <div className="border border-gray-200/10 p-1 rounded-md shadow-sm">
          <input
            placeholder="Amount"
            className="border border-white/10 bg-indigo-900/60 rounded-md p-2 w-36 text-right text-xl "
            type="text"
            value={value}
            onChange={onChange}
          />
          <span className="mx-3 text-gray-200/50 text-xl">USD</span>
        </div>
      </div>
      <AnimatePresence>
        {inputError && (
          <motion.div
            className="flex items-center justify-center mt-1 text-red-500"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0 }}
            transition={{ duration: 0.1 }}>
            <p className="text-center">{inputError}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Input;
