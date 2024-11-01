SELECT
    A.TOP_CODI AS [TIPO]
    ,A.CON_NUME AS [NUM_CONTRATO]
	,CONCAT(A.CON_NUME, '-', A.TOP_CODI )AS [CODIGO]
	,G.RUB_CODI AS [RUBRO]
	,J.RUB_NOMB AS [NOMBRE]
	,D.TER_NOCO AS [CLIENTE]
    ,I.ARB_CODI AS [CON_INTERADMINISTRATIVO]
    ,I.ARB_NOMB AS [NOMBRE_INTERADMINISTRATIVO]
	,E.VAL_AN07 AS [TIPOLOG�A]
	,A.CON_ANOP AS [A�O]
	,CASE
    WHEN A.CON_ESTA= 'M' THEN 'MINUTA'
    WHEN A.CON_ESTA= 'L' THEN 'IMPUESTOS'
    WHEN A.CON_ESTA= 'A' THEN 'ACTIVO'
	WHEN A.CON_ESTA= 'S' THEN 'SUSPENDIDO'
	WHEN A.CON_ESTA= 'N' THEN 'ANULADO'
	WHEN A.CON_ESTA= 'F' THEN 'FACTURADO'
	WHEN A.CON_ESTA= 'Q' THEN 'LIQUIDADO'
    ELSE 'LIQUIDADO' END AS [ESTADO]

	,A.CON_FECH AS FECHA_CONTRATO
	,A.CON_PLAZ AS PLAZO
    
	,CASE WHEN  A.CON_UPLA ='H' THEN 'HORAS'
	WHEN  A.CON_UPLA ='D' THEN 'DIAS'
	WHEN  A.CON_UPLA ='S' THEN 'SEMANAS'
	WHEN  A.CON_UPLA ='M' THEN 'MESES'
	ELSE 'DIAS' END AS [TIPO_PLAZO]
    --REDUCCIONES
	,A.CON_PLTP AS [PRORROGA_DIAS]
	,A.CON_PLAT AS [TOTAL_DIAS]
	,C.TER_NOCO AS [SUPERVISOR]
	,N.COM_CODI AS [PROY_CODI]
	,N.COM_NOMB AS [PROYECTO]
	,M.DPR_PORC AS [PORCENTAJE_PROYECTO]
    ,A.CON_FINI AS [FECHA_INI_CONTRATO]
    ,A.CON_FEFI AS [FECHA_FINAL_CONTRATO]
    ,A.CON_FFIN AS [FECHA_REAL_FINI]
    ,DATEADD(MONTH, 6, DATEADD(YEAR, 2, A.CON_FFIN)) AS [FECHA_COMPETENCIA]
	,A.CON_PLAZ AS [PLAZO]
    ,A.CON_PLTP as [TIPO_PLAZO]
   ,B.TPC_NOMB AS [TIPO_CONTRATO]
    ,COALESCE(F.VALTOTAL, 0) AS [VALTOTAL]
    ,COALESCE(F.PAGO_TOTAL, 0) AS [PAGO_TOTAL]
   ,C.TER_ACTI AS [ACTIVO]
	,I.ARB_CODI AS [CONVENIO]
    ,I.ARB_NOMB AS [NOMBRE_CONVENIO]
	,B.TPC_NOMB AS [TIPO_CONTRATO]
	,A.CON_ESTA AS [CT_ESTADO]	
	,A.CON_UPLA as [TIPO_PLAZO]
	,E.VAL_AN06 AS [SUBGERENCIA]

FROM CT_CONTR A
		LEFT  JOIN GN_VALPE E ON A.EMP_CODI = E.EMP_CODI AND A.CON_CONT = E.VAL_ORIG AND E.PRO_CODI ='SCTCONTR'
		INNER JOIN CT_DDISP H ON A.EMP_CODI = H.EMP_CODI AND A.CON_CONT = H.CON_CONT AND H.TAR_CODI = 3
		INNER JOIN GN_ARBOL I ON H.EMP_CODI = I.EMP_CODI AND H.ARB_CONT = I.ARB_CONT 
		INNER JOIN CT_TPCTR B ON A.EMP_CODI = B.EMP_CODI AND A.TPC_CONT = B.TPC_CONT
		INNER JOIN GN_TERCE C ON A.EMP_CODI = C.EMP_CODI AND A.CON_COOR = C.TER_CODI
		INNER JOIN GN_TERCE D ON A.EMP_CODI = D.EMP_CODI AND A.TER_CODI = D.TER_CODI
		LEFT  JOIN V_CT_HIS F ON A.EMP_CODI = F.EMP_CODI AND A.CON_NUME = F.CON_NUME AND A.TOP_CODI = F.TOP_CODI AND A.CON_ANOP = F.CON_ANOP
		INNER JOIN CT_DRDOC G ON A.EMP_CODI = G.EMP_CODI AND A.CON_CONT = G.CON_CONT
		INNER JOIN PG_RUBRO J ON G.EMP_CODI = H.EMP_CODI AND G.RUB_CONT = J.RUB_CONT
	    INNER JOIN CV_CONVE K ON K.EMP_CODI = E.EMP_CODI AND K.CON_CONT = E.VAL_NU02   --VAL_AN01 AND  E.PRO_CODI ='SCTCONTR'
		INNER JOIN CV_PROYE L ON K.EMP_CODI = L.EMP_CODI AND K.CON_CONT = L.CON_CONT
		INNER JOIN CV_DPROY M ON L.EMP_CODI = M.EMP_CODI AND L.PRO_CONT = M.PRO_CONT
		INNER JOIN CV_COMPO N ON M.EMP_CODI = N.EMP_CODI AND M.COM_CONT = N.COM_CONT

WHERE
	-- A.CON_ESTA = 'A'  AND 
	 A.TOP_CODI IN (3302, 3306, 3322, 3325, 3326, 3327)
	 AND A.CON_ANOP=2024
	-- AND A.CON_NUME IN (186)

ORDER BY A.CON_CONT;

