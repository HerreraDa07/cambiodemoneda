import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { IoLogoGithub } from "react-icons/io";
import { FaLinkedin } from "react-icons/fa";
const App = () => {
  const [monedas, setMonedas] = useState([]);
  const [moneda1, setMoneda1] = useState(null);
  const [moneda2, setMoneda2] = useState(null);
  const [cantidad, setCantidad] = useState(0);
  const [dinero, setDinero] = useState(null);
  const [datos, setDatos] = useState([]);
  const [modal, setModal] = useState(false);

  function abrir() {
    setModal(true);
  }

  function cerrar() {
    setModal(false);
  }

  useEffect(() => {
    const Get = async () => {
      try {
        const request = await axios.get(
          "https://v6.exchangerate-api.com/v6/b858cdbb94b4b10cc084e285/codes"
        );
        const supported = request.data.supported_codes.map(
          ([code, name], index) => ({
            id: index + 1,
            code,
            name,
          })
        );
        setMonedas(supported);
      } catch (error) {
        console.error("Error al hacer el request: ", error);
      }
    };

    Get();
  }, []);

  const conversion = async (e) => {
    if (e) e.preventDefault();
    if (!moneda1 || !moneda2 || cantidad === 0) {
      abrir();
    } else {
      try {
        const request = await axios.get(
          `https://v6.exchangerate-api.com/v6/b858cdbb94b4b10cc084e285/pair/${moneda1.code}/${moneda2.code}/${cantidad}`
        );
        setDatos(request.data);
        setDinero(cantidad);
      } catch (error) {
        console.error("Ocurrio un error inesperado: ", error);
      }
    }
  };
  return (
    <div className="h-screen w-screen flex flex-col">
      <header className="bg-black text-4xl text-white text-center font-bold py-5 lg:text-5xl">
        <h1>Conversor de divisas</h1>
      </header>
      <main className="grow-1 bg-gray-100">
        <div className="h-full flex justify-center p-4">
          <div className="h-full w-full flex flex-col rounded-4xl lg:w-2/3 lg:flex lg:flex-row bg-gray-200 shadow-xl lg:bg-white lg:shadow-2xl">
            <div className="min-h-[500px] rounded-t-4xl rounded-bl-[90px] lg:h-full lg:w-1/2 bg-white">
              <div className="h-full w-full flex flex-col justify-center items-center grow-1 p-5 gap-4 lg:p-10 lg:gap-12 lg:justify-start">
                <h2 className="text-3xl font-bold text-center lg:text-5xl">
                  Conversión
                </h2>
                <p className="text-2xl">
                  Cantidad monetaria que desea convertir
                </p>
                <form onSubmit={conversion} className="w-full">
                  <label htmlFor="cantidad"></label>
                  <input
                    type="number"
                    placeholder="Digite la cantidad de dinero"
                    value={cantidad}
                    onChange={(e) => setCantidad(e.target.value)}
                    className="w-full pl-1.5 py-1 border-3 border-gray-300 rounded-2xl shadow-xl"
                    style={{ appearance: "textfield" }}
                    onInput={(e) =>
                      (e.target.value = e.target.value.replace(/[^0-9]/g, ""))
                    }
                    required
                  />
                </form>
                <p className="w-full text-2xl">De:</p>
                <Listbox value={moneda1} onChange={setMoneda1}>
                  <div className="relative w-full">
                    <ListboxButton className="w-full text-left p-3 bg-white border border-gray-300 rounded-2xl shadow-xl cursor-pointer">
                      {moneda1
                        ? `${moneda1.code} ${moneda1.name}`
                        : "Selecione una divisa"}
                    </ListboxButton>
                    <ListboxOptions className="border border-gray-300 rounded-2xl shadow-xl max-h-60 overflow-auto absolute w-full bg-white p-3 z-1">
                      {monedas.map((m) => (
                        <ListboxOption
                          key={m.id}
                          value={m}
                          className={({ focus, selected }) =>
                            `cursor-pointer select-none py-2 pl-3 pr-4 ${
                              focus ? "bg-blue-500 text-white" : "text-gray-900"
                            } ${selected ? "font-bold" : ""}`
                          }
                        >
                          {m.code} {m.name}
                        </ListboxOption>
                      ))}
                    </ListboxOptions>
                  </div>
                </Listbox>
                <p className="w-full text-2xl">A:</p>
                <Listbox value={moneda2} onChange={setMoneda2}>
                  <div className="relative w-full">
                    <ListboxButton className="w-full text-left p-3 bg-white border border-gray-300 rounded-2xl shadow-xl cursor-pointer">
                      {moneda2
                        ? `${moneda2.code} ${moneda2.name}`
                        : "Selecione una divisa"}
                    </ListboxButton>
                    <ListboxOptions className="border border-gray-300 rounded-2xl shadow-xl max-h-60 overflow-auto absolute w-full bg-white p-3">
                      {monedas.map((m) => (
                        <ListboxOption
                          key={m.id}
                          value={m}
                          className={({ focus, selected }) =>
                            `cursor-pointer select-none py-2 pl-3 pr-4 ${
                              focus ? "bg-blue-500 text-white" : "text-gray-900"
                            } ${selected ? "font-bold" : ""}`
                          }
                        >
                          {m.code} {m.name}
                        </ListboxOption>
                      ))}
                    </ListboxOptions>
                  </div>
                </Listbox>
                <button
                  type="submit"
                  className="bg-white border-3 border-gray-300 rounded-2xl shadow-xl p-3 hover:bg-green-500 hover:text-white hover:border-black w-1/3 text-2xl"
                  onClick={() => conversion()}
                >
                  <p>Convertir</p>
                </button>
              </div>
            </div>
            <div className="min-h-[500px] rounded-4xl lg:h-full lg:w-1/2 bg-gray-200 lg:rounded-l-none lg:rounded-bl-[90px]">
              <div className="h-full w-full flex flex-col p-5 lg:p-10">
                <h3 className="text-3xl font-black text-center lg:text-5xl">
                  Resultado de la conversión
                </h3>
                <div className="h-full flex flex-col justify-center items-center ">
                  <p className="flex flex-col text-3xl">
                    {datos && datos.conversion_result ? (
                      <>
                        El valor de la conversión de: <br />
                        <span className="text-red-500">{dinero}</span>{" "}
                        {moneda1.code} ({moneda1.name}) <br />
                        a <br />
                        {moneda2.code} ({moneda2.name}) es de{" "}
                        <span className="text-green-500">
                          {datos.conversion_result}
                        </span>
                        <br />
                        <span className="text-red-500">
                          1 {moneda1.code} ({moneda1.name})
                        </span>
                        equivale a{" "}
                        <span className="text-green-500">
                          {datos.conversion_rate} {moneda2.code} ({moneda2.name}
                          )
                        </span>
                      </>
                    ) : (
                      <span>Aún no hay datos</span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer className="flex flex-col bg-black text-white py-5 text-center">
        <div className="flex flex-col justify-center items-center gap-2 lg:flex-row lg:gap-4">
          <h4>
            © 2025 - Desarrollado por David Herrera <br />
            Construido con React y Tailwind CSS
          </h4>
          <hr className="border-2 border-white w-2/3 lg:w-0 lg:h-full" />
          <h5>davidherrera20020707@gmail.com</h5>
          <div className="h-10 w-full flex flex-row justify-center px-20 lg:w-auto lg:p-0 lg:h-full lg:gap-4">
            <a href="" className="w-1/3">
              <IoLogoGithub className="h-full w-full" />
            </a>
            <a href="" className="w-1/3">
              <FaLinkedin className="h-full w-full" />
            </a>
          </div>
        </div>
      </footer>
      <>
        <Dialog open={modal} as="div" onClose={cerrar}>
          <div className="fixed inset-0 z-0 w-screen overflow-y-auto">
            <div className="h-full w-full flex justify-center items-center p-4 bg-gray-900/50">
              <DialogPanel
                transition
                className="h-auto w-full bg-white rounded-xl p-4 ring-3 text-center gap-4 flex flex-col"
              >
                <DialogTitle className="text-5xl">
                  <p>
                    {cantidad === 0
                      ? "Debe digitar un valor"
                      : !moneda1 && !moneda2
                      ? "Debe escoger dos monedas para hacer la conversión"
                      : "Debe escoger otra moneda para hacer la conversión"}
                  </p>
                </DialogTitle>
                <p></p>
                <div>
                  <button
                    className="text-4xl border-3 border-gray-500 p-3 rounded-xl shadow-xl hover:bg-red-500 hover:text-white hover:border-black"
                    onClick={cerrar}
                    type="button"
                  >
                    <p>Cerrar</p>
                  </button>
                </div>
              </DialogPanel>
            </div>
          </div>
        </Dialog>
      </>
    </div>
  );
};

export default App;
