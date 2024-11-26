SELECT  
		A.CON_NCON AS [CONTRATO_INTERADMINISTRATIVO]
		,A.CON_NOMB AS [NOMBRE_INTERADMINISTRATIVO]
		,B.CLI_NOCO AS CLIENTE 
		,C.VAL_AN02 AS ESTADO
		,A.CON_OBJE AS OBJETO
		,A.CON_FECH AS [FECHA_SUSCRIPCION]
		,A.CON_FECA AS [FECHA_ACTA_DE_INICIO]
		,A.CON_FECM AS  [FECHA_MINUTA]
		,A.CON_FETE AS [FECHA_TERMINACION]
		,A.CON_PLAZ  AS PLAZO
		,A.CON_VALH AS [VALOR_HONORARIOS]
		,A.CON_VALP AS VALOR
		,A.CON_PORH AS [PORCENTAJE_HONORARIOS]
		,C.VAL_AN08 AS [PORC_HONORARIOS_PREDIOS]
		,G.TER_CODA AS [DOC_COORDINADOR]
		,G.TER_NOCO AS COORDINADOR
		,H.TER_CODA AS [DOC_PMP]
		,H.TER_NOCO AS PMP 
		,I.TER_CODA AS [DOC_ADMINISTRATIVO]
		,I.TER_NOCO AS ADMINISTRATIVO
		,A.CON_CCLI AS [CENTRO_DE_COSTOS]
		,L.RUB_CONT AS [RUBRO_ID]
		, L.RUB_CODI AS RUBRO
		, L.RUB_NOMB AS [NOMBRE_RUBRO]
		,Z.PRO_CONT 
		, M.COD_PROY AS PROYECTO
		 ,Z.PRO_NOMB AS [NOMBRE_DE_PROYECTO]
		, M.COD_COMP AS COMPONENTE
		,L.COM_NOMB AS [NOMBRE_COMPONENTE]
		,L.RUB_FUEN as [FUENTE]
		,L.FUE_NOMB AS [NOMBRE_FUENTE]
		,J.SRS_AINC AS [APROPIACION_INICIAL]
		,J.APRO_DEFINITIVA AS [APROPIACION_DEFINITIVA]
		,J.SRS_CDPS AS [CDP]
		,J.DISPONIBLE 
		,J.SRS_COMP AS [COMPROMETIDO]
		,J.SRS_PAGOS AS [PAGOS]
		,SUM(J.DISPONIBLE +SALDO_CDP ) AS [POR_COMPROMETER]
		,J.POR_PAGAR
		,J.SRS_ANOP
		
	
		FROM CV_CONVE A
			INNER JOIN FA_CLIEN B ON A.EMP_CODI = B.EMP_CODI AND A.CLI_CODI = B.CLI_CODI
			INNER JOIN GN_VALPE C ON A.EMP_CODI = C.EMP_CODI AND A.CON_CONT = C.VAL_ORIG
			INNER JOIN GN_VALPE E ON A.EMP_CODI = E.EMP_CODI AND A.CON_CONT = E.VAL_ORIG
			INNER JOIN EDU_RUBR L ON A.EMP_CODI = L.EMP_CODI AND A.CON_CCLI = L.RUB_CONV
			FULL JOIN CV_PROYE D ON L.EMP_CODI = D.EMP_CODI AND L.RUB_CONT = D.CON_CONT AND L.RUB_PROY = D.PRO_CODI
			FULL JOIN CV_PROYE Z ON D.EMP_CODI = Z.EMP_CODI AND D.PRO_CONT = Z.PRO_CONT
		    FULL JOIN V_PG_CVRUBRO J ON L.EMP_CODI =J.EMP_CODI AND L.RUB_CONT =J.RUB_CONT
			INNER JOIN PANEL_CV_TOTAL_DET M ON L.RUB_CONV = M.COD_CONV  AND L.RUB_PROY = M.COD_PROY  AND L.RUB_COMP =M.COD_COMP
			full JOIN GN_TERCE G ON C.EMP_CODI = G.EMP_CODI AND C.VAL_AN05 = G.TER_CODA
			full JOIN GN_TERCE H ON C.EMP_CODI = H.EMP_CODI AND C.VAL_AN06 = H.TER_CODA
			full JOIN GN_TERCE I ON C.EMP_CODI = I.EMP_CODI AND C.VAL_AN06 = I.TER_CODA
			
	
			
			
	WHERE A.CON_ANOP >= 2010
	   --AND A.CON_NCON= '102588 DE 2024'
	  -- AND L.RUB_CONT =31928
	
	GROUP BY A.CON_NCON,A.CON_NOMB,B.CLI_NOCO, C.VAL_AN02, A.CON_OBJE, A.CON_FECH, A.CON_FECA, A.CON_FECM, A.CON_FETE, A.CON_PLAZ, A.CON_VALH, A.CON_VALP, A.CON_PORH, C.VAL_AN08,
	G.TER_CODA 	,G.TER_NOCO ,H.TER_CODA ,H.TER_NOCO ,I.TER_CODA ,I.TER_NOCO ,A.CON_CCLI, L.RUB_CONT, L.RUB_CODI, L.RUB_NOMB, M.COD_PROY,
	Z.PRO_NOMB, 
	M.COD_COMP , 
	L.COM_NOMB, L.RUB_FUEN, L.FUE_NOMB, J.SRS_AINC, J.APRO_DEFINITIVA, J.SRS_CDPS, J.DISPONIBLE, J.SRS_COMP, J.SRS_PAGOS, J.POR_PAGAR,J.SRS_ANOP, Z.PRO_CONT 
	
	ORDER BY [CONTRATO_INTERADMINISTRATIVO],[FECHA_SUSCRIPCION], RUBRO, PROYECTO
	
