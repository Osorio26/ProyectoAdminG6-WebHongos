const FileInfoModal = ({ onClose }) => {
    
  return (
    <div className="modal-backdrop">
      <div className="modal-content" style={{width: "650px", textAlign: "left", height: "60vh"}}>
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>

        <div className="modal-title" style={{paddingBottom:"1rem"}}>Formato Archivo Categorías</div>

        <article className="format-doc">

      <div className="modal-subtitle">Consideraciones de formato</div>

      <ol className="consideraciones-list">
        <li>
            <p>
                El nombre del archivo debe ser '<strong>categorias_hongos.txt</strong>'.
            </p>
        </li>
        <li>
            <p>
                Cualquier texto que se encuentre entre paréntesis "()" se
                interpreta como <strong>título para una categoría</strong> dada.
            </p>
            <p className="ejemplo-inline">
                Ejemplo: <em>(Tipos de Hongo)</em> → Esto se toma como
                un título.
            </p>
        </li>

        <li>
          <p>
            El símbolo "-----"" (con 5 'dash') indica una <strong> separación entre una categoría y otra. </strong>
          </p>
        </li>

        <li>
          <p>
            <strong>Los elementos se leen línea por línea</strong>; cada línea representa un
            elemento que se quiere agregar a las posibles opciones.
          </p>
        </li>

        <li>
          <p>
             <strong>Los espacios en blanco se ignoran</strong>, aunque por temas de orden es
            recomendable evitarlos.
          </p>
        </li>
      </ol>

      <div className="modal-subtitle">Formato de ejemplo</div>

      <p>
        Suponga que quiere crear un archivo para las categorías{" "}
        <strong>“Medio de cultivo”</strong> y <strong>“Tipo de Ensayo”</strong>,
        el texto del archivo para lograr esos resultados sería el siguiente:
      </p>

      <pre className="text-block">
        {`        (Medio de cultivo)
        PDA (Potato Dextrose Agar)
        MEA (Malt Extract Agar)
        Sabouraud Dextrose Agar (SDA)
        WA (Water Agar)
        CZ (Czapek-Dox Agar)
        -----
        (Tipo de ensayo)
        Externo
        Interno
        Temporal`}
      </pre>
    </article>
      </div>
    </div>
  );
};

export default FileInfoModal;