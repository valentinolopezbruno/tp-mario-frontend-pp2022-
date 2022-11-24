import {useState, useEffect,useRef} from 'react';
import './App.css';
import Swal from 'sweetalert2'
import ReactModal from 'react-modal'



function App() {
  const [getAlumnos, setAlumnos] = useState(null) 
  const [getBuscador, setBuscador] = useState('') 
  const [getEditarAlumno, setEditarAlumno] = useState(null)
  const [getAgregarAlumno, setAgregarAlumno] = useState(null)

  const nombreRef = useRef(null)
  const DniRef = useRef(null)
  const DomicilioRef = useRef(null)
  const TelefonoRef = useRef(null)

  const url = 'http://localhost:4000/alumnos'

  const consultarAlumnos =  async () => {
    await fetch(url)
    .then(res => res.json())
    .then(res => setAlumnos(res))
  }

  const buscadorFilter = (value) => {
    if(value.nombre.toLowerCase().indexOf(getBuscador.toLowerCase()) != -1) return value
}


  const eliminarAlumno = (id) => {
      Swal.fire({
    title: 'Desea eliminar el Alumno seleccionado?',
    showDenyButton: true,
    confirmButtonText: 'Eliminar',
    denyButtonText: `No Eliminar`,
  }).then((result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {
        fetch(`http://localhost:4000/alumnos/${id}`, { method: 'DELETE' })
        .then(res => console.log(res))
        Swal.fire(
            'Alumno Eliminado',
            '',
            'success'
          )
          setTimeout(function(){
            window.location.reload();
        }, 1000);
    }
  })
  }

  const guardarCambiosEditar = () => {
    console.log(getEditarAlumno)
    fetch(`http://localhost:4000/alumnos/${getEditarAlumno.id}`, {body:JSON.stringify(getEditarAlumno), headers: {'Content-Type': 'application/json'}, method: 'PATCH' })
    .then(res => console.log(res)).catch(err => console.log(err))
    Swal.fire(
        'Alumno Editado',
        '',
        'success'
      )
      setTimeout(function(){
        setEditarAlumno(null)
        window.location.reload();
    }, 1000);
  }

    const guardarCambiosAgregar =  async () => {
        const nombre = nombreRef.current.value
        const dni = DniRef.current.value
        const domicilio = DomicilioRef.current.value
        const telefono = TelefonoRef.current.value

        const body  = {
            nombre: nombre,
            dni: dni,
            domicilio: domicilio.toString(),
            telefono: telefono
        }
        console.log(body)
    await fetch(`http://localhost:4000/alumnos`, {body:JSON.stringify(body), headers: {'Content-Type': 'application/json'}, method: 'POST' })
    .then(res => console.log(res)).catch(err => console.log(err))
    Swal.fire(
        'Alumno Agregado',
        '',
        'success'
      )
      setTimeout(function(){
        setAgregarAlumno(null)
        window.location.reload();
    }, 1000);
  } 

  useEffect(() => {
    consultarAlumnos()
  },[])

  return (
    <div className="App">
                 <div style={{marginTop:'1rem', display:'flex'}} className='buscador-f'>
                    <input  type="text" placeholder="Buscar Alumnos" defaultValue={getBuscador} onChange={(e) => setBuscador(e.target.value)}/>
                </div> 
                <div style={{marginBottom:'0.5rem'}}>
                      <button  style={{width:'60rem'}} onClick={() => setAgregarAlumno(1)} className='btn-guardar'>AGREGAR ALUMNO </button>
                </div>
            <div style={{alignItems:'center', textAlign:'center'}}>
                
                <table className='tabla-productos'>
                    <thead>
                        <tr>
                            <td > NOMBRE  </td>
                            <td > DNI </td>
                            <td > DOMICILIO </td>
                            <td > TELEFONO  </td>
                            <td>  ACCIONES  </td>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            getAlumnos != null && getAlumnos.filter(buscadorFilter).map((value, index) => {
                                return (
                                    <tr key={`tb-l-${index}`}>
                                        <td>{value.nombre}</td>
                                        <td>{value.dni}  </td>
                                        <td>{value.domicilio}   </td>
                                        <td>{value.telefono} </td>
                                        <td>
                                          <button style={{marginRight:'2rem'}} className='btnEliminar' onClick={()=> eliminarAlumno(value.id)}>Eliminar</button>
                                          <button className='btnEditar' onClick={()=> setEditarAlumno(value)}>Editar</button>
                                          </td>
                                    </tr>
                                )
                            })
                        }
                        </tbody>
                </table>
            </div>
            
            <div className='modal'>
            <ReactModal
            isOpen={getEditarAlumno != null} 
            onRequestClose={() => setEditarAlumno(null)}
            ariaHideApp={false}
            style={{
                overlay: {
                    zIndex:1000,
                    display:'flex',
                    justifyContent:'center',
                    alignItems:'center',
                    backgroundColor: 'rgba(0, 0, 0, 0.50)',
                    padding:0,
                    right:0
                },
                content: {
                    maxHeight:'90%',
                    overflow:'auto'
                }
            }}
            className="modalcarrito"
            preventScroll={true}
            contentLabel="Example Modal">
                {getEditarAlumno != null &&
                    <div style={{alignItems:'center', textAlign:'center'}}>
                        {/* titulo */}
                        <div className='modal-title' >
                            <span>EDITAR {getEditarAlumno.nombre}</span>
                        </div>

                        {/* editar nombre */}
                        <div className='modal-input'>
                            <p>Nombre del Alumno</p>
                            <input type="text" id="productoName" value={getEditarAlumno.nombre} placeholder="Nombre del Alumno" onChange={(e) => setEditarAlumno(i => { return {...i, nombre: e.target.value} } )}/>
                        </div>

                         {/* editar formato */}
                         <div className='modal-input'>
                            <p>DNI del Alumno</p>
                            <input type="number" id="productoName" value={getEditarAlumno.dni} placeholder="Formato del Producto" onChange={(e) => setEditarAlumno(i => { return {...i, dni: e.target.value} } )}/>
                        </div>

                        {/* editar precio */}
                        <div className='modal-input' >
                            <p>Domicilio del Alumno</p>
                            <input type="text" id="productoPrecio" value={getEditarAlumno.domicilio} placeholder="Precio del Producto"  onChange={(e) => setEditarAlumno(i => { return {...i, domicilio: e.target.value} } )}/>
                        </div>

                         {/* editar descripcion */}
                         <div className='modal-input' >
                            <p>Telefono del Alumno</p>
                            <input type="number" id="productoDescrip" value={getEditarAlumno.telefono} placeholder="Descripcion del Producto"  onChange={(e) => setEditarAlumno(i => { return {...i, telefono: e.target.value} } )}/>
                        </div>

                        <div >
                            <button className='botonVolverYCerrar' onClick={() => setEditarAlumno(null)} style={{marginRight:'1rem'}}>Volver</button>
                            <button className='btn-guardar'  onClick={() => guardarCambiosEditar() }>Guardar Cambios</button>
                        </div>
                    </div>
                    }
            </ReactModal>
            </div>

            {/* AGREGAR ALUMNOS */}

            <div className='modal'>
            <ReactModal
            isOpen={getAgregarAlumno != null} 
            onRequestClose={() => setAgregarAlumno(null)}
            ariaHideApp={false}
            style={{
                overlay: {
                    zIndex:1000,
                    display:'flex',
                    justifyContent:'center',
                    alignItems:'center',
                    backgroundColor: 'rgba(0, 0, 0, 0.50)',
                    padding:0,
                    right:0
                },
                content: {
                    maxHeight:'90%',
                    overflow:'auto'
                }
            }}
            className="modalcarrito"
            preventScroll={true}
            contentLabel="Example Modal">
                {getAgregarAlumno != null &&
                    <div style={{alignItems:'center', textAlign:'center'}}>
                        
                        <div className='modal-title' >
                            <span>Agregar Alumno</span>
                        </div>
                        
                         <div className='modal-input'>
                                <p className='modal-input'><b>Nombre del Alumno</b></p>
                                <input type="text" ref={nombreRef} defaultValue={""} placeholder="Nombre Alumno"/>
                          </div>
                          <div className='modal-input' >
                                <p className='modal-input'><b>DNI del Alumno</b></p>
                                <input type="nomber" ref={DniRef} defaultValue={""} placeholder="DNI Alumno"/>
                          </div>
                          <div className='modal-input' >
                                <p className='modal-input'><b>Direccion del Alumno</b></p>
                                <input type="text" ref={DomicilioRef} defaultValue={""} placeholder="Direccion Alumno"/>
                          </div>
                          <div className='modal-input' >
                                <p className='modal-input'><b>Telefono del Alumno</b></p>
                                <input type="number" ref={TelefonoRef} defaultValue={""} placeholder="Telefono Alumno"/>
                          </div>
                          <div >
                            <button className='botonVolverYCerrar' onClick={() => setAgregarAlumno(null)} style={{marginRight:'1rem'}}>Volver</button>
                            <button className='btn-guardar'  onClick={() => guardarCambiosAgregar() }>Guardar Cambios</button>
                        </div>
                    </div>
                    }
            </ReactModal>
            </div>
    </div>
  );
}

export default App;
