import "./App.css"
import "bootstrap/dist/css/bootstrap.css"
import { useEffect, useState, useReducer } from "react"
import soundFile from "./src_res_sounds_ineedmoney.mp3"

const NumberInput = ({ id, value, onInputChange, type, children }) => {
  return (
    <div className="mb-3 mx-auto w-25 align-items-center row">
      <div className="col-auto">
        <label htmlFor="step" className="form-label text-white fs-1 ">
          {children}
        </label>
      </div>
      <div className="col-auto">
        <input
          onChange={onInputChange}
          id={id}
          type={type}
          value={value}
          className="form-control "
        />
      </div>
    </div>
  )
}

const counterReducer = (state, action) => {
  switch (action.type) {
    case "INCREMENT":
      return {
        ...state,
        counter: state.counter + state.step,
      }
    case "DECREMENT":
      return {
        ...state,
        counter: state.counter - state.step,
      }
    case "RESET":
      return {
        ...state,
        counter: 0,
      }
    case "CHANGE_STEP":
      return {
        ...state,
        step: action.payload,
      }
    default:
      throw new Error(
        `counterReducer: Utilisation of an unknow action : ${action.type}`
      )
  }
}

const Counter = ({ onCount, isDisabled }) => {
  const [state, dispatch] = useReducer(counterReducer, {
    counter: 0,
    step: 1,
  })
  const { counter, step } = state

  const handleCounterMore = () => {
    dispatch({ type: "INCREMENT" })
    onCount((a) => a + 1)
  }
  const handleCounterLess = () => {
    dispatch({ type: "DECREMENT" })
    onCount((a) => a + 1)
  }
  const handleCounterReset = () => {
    dispatch({ type: "RESET" })
  }

  const handleStepChange = (e) => {
    dispatch({ type: "CHANGE_STEP", payload: Number(e.target.value) })
  }
  return (
    <>
      <p className="fs-1 text-white">Compteur : {counter}</p>
      <button
        disabled={isDisabled}
        onClick={handleCounterMore}
        className="btn btn-info me-2"
      >
        Incrémenter le compteur
      </button>
      <button onClick={handleCounterReset} className="btn btn-warning me-2">
        Reset
      </button>
      <button
        disabled={isDisabled}
        onClick={handleCounterLess}
        className="btn btn-danger me-2"
      >
        Décrémenter le compteur
      </button>
      <NumberInput
        id="step"
        type="number"
        onInputChange={handleStepChange}
        value={step}
      >
        Step :
      </NumberInput>
    </>
  )
}

const useLocalStorage = (key, initialValue) => {
  const [value, setValue] = useState(
    () => Number(localStorage.getItem(`${key}`)) || initialValue
  )

  useEffect(() => {
    localStorage.setItem(`${key}`, value)
  }, [key, value])
  return [value, setValue]
}

const App = () => {
  const [nbOp, setNbOp] = useLocalStorage("number-operation", 0)
  const [isDisabled, setIsDisabled] = useState(false)

  useEffect(() => {
    if (nbOp >= 20) {
      const disable = async () => {
        setIsDisabled(true)
        try {
          const audio = new Audio(soundFile)
          await audio.play()
        } catch (error) {
          console.log(error)
        }
      }
      disable()
    } else {
      setIsDisabled(false)
    }
  }, [nbOp])

  return (
    <div className="App bg-dark min-vh-100 text-center">
      <h1 className="display-1  text-white">Hello Hard Fork</h1>
      <hr className="border border-white" />
      <p className="fs-1 text-white">Nombre d'opérations : {nbOp}</p>
      {nbOp >= 20 ? (
        <>
          <p className="text-danger fs-3">
            Vous avez atteint la limite... Allez <a href="">ICI</a> pour
            racheter des crédits.
          </p>
          <button onClick={() => setNbOp(0)} className="btn btn-light me-2">
            Remettre votre compteur à zéro (debug)
          </button>
        </>
      ) : (
        ""
      )}
      <Counter isDisabled={isDisabled} onCount={setNbOp} />
    </div>
  )
}

export default App
