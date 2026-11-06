/** Decorative landscape: deliberately independent of weather and risk data. */
export function ForestScene() {
  return <div className="forest-poster" aria-hidden="true">
    <div className="poster-heading"><span>MER UTELIV.</span><span>MED OMTANKE.</span></div>
    <svg className="forest-art" viewBox="0 0 600 680" fill="none" focusable="false">
      <circle className="forest-sun" cx="397" cy="213" r="104" fill="#ee703e" />
      <g stroke="#877e62" strokeWidth="1" opacity=".35">
        <circle cx="397" cy="213" r="126"/><circle cx="397" cy="213" r="149"/>
      </g>
      <path d="M0 367Q100 234 218 323T420 306T600 324V680H0Z" fill="#a2ad8b"/>
      <path d="M0 430Q120 316 275 413T600 368V680H0Z" fill="#657e62"/>
      <path d="M0 500Q153 400 308 485T600 420V680H0Z" fill="#365745"/>
      <g fill="#234537">
        {[ [35,365,1.1], [115,330,.9], [190,410,.65], [490,340,1.2], [555,300,1.4], [420,400,.7] ].map(([x,y,s], i) =>
          <g key={i} transform={`translate(${x} ${y}) scale(${s})`}>
            <path d="M0-105 32-40H19L43 7H27L56 62H5V100H-5V62H-56L-27 7H-43L-19-40H-32Z"/>
          </g>)}
      </g>
      <path d="M0 574Q158 486 320 551T600 500V680H0Z" fill="#102f26"/>
      <path d="M360 680C300 614 465 594 365 548C433 573 371 613 446 680" fill="#d3bd88"/>
      <g fill="#102f26">
        <path d="M65 325 107 413H88L125 483H103L148 569H75V659H55V569H-18L27 483H5L42 413H23Z"/>
        <path d="M535 412 569 482H552L584 543H564L603 615H543V680H527V615H467L506 543H486L518 482H501Z"/>
      </g>
      <g className="forest-birds" stroke="#234537" strokeWidth="3" strokeLinecap="round">
        <path d="M186 200q12-8 24 0 12-8 24 0M253 168q8-6 16 0 8-6 16 0"/>
      </g>
    </svg>
    <span className="poster-footnote">LÄMNA BARA FOTSPÅR.</span>
  </div>;
}
