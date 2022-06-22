import React, {useEffect, useState} from "react";
import Grid from "@mui/material/Grid";

import 'chart.js/auto';
import {Chart} from 'react-chartjs-2';
import {SubTitle, Title} from "../utils/Title";
import {getBatterySai, getSais} from "../../services/Sais";


const Battery = () => {
    const [sais, setSais] = useState([]);
    const [battery, setBattery] = useState([]);

    useEffect(function () {

        getBatterySais_api();

    }, [])

    const data = {
        labels: sais,
        datasets: [{
            label: 'Sais (min)',
            backgroundColor: '#5F9EA0',
            borderColor: 'black',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(0,255,0,0.2)',
            hoverBorderColor: '#FF0000',
            data: battery
        }]
    };
    const opciones = {
        maintainAspectRatio: true,
        responsive: true
    }

    const getBatterySais_api = async () => {


        const responseSais = await getSais();
        console.log(responseSais)

        var name_sais = [];
        var minutes_battery = [];

        for (const objSai of responseSais.results) {
            var levelBattery;

            var modelSai = {
                "id": objSai.id,
                "name_sai": objSai.name_sai,
                "url": objSai.url,
                "userConnection": objSai.userConnection,
                "authKey": objSai.authKey,
                "privKey": objSai.privKey,
                "code_oid": objSai.code_oid
            }

            levelBattery = await getBatterySai(modelSai);
            name_sais.push(objSai.name_sai);
            minutes_battery.push(levelBattery);
        }

        setSais(name_sais);
        setBattery(minutes_battery);

    }

    return (
        <>
            <Grid
                container
                spacing={2}
                direction="column"
                alignItems="center"
                justify="center"
                marginTop={5}
                marginBottom={8}
                //justifyContent="center"
            >
                <Title title={'BATERÍA'}/>
                <SubTitle title={'Nivel de Batería de los Sais en (Minutos)'}/>
                <Grid marginTop={10} width={"70%"}>
                    <Chart type='bar' data={data} options={opciones}/>
                </Grid>
            </Grid>
        </>
    );
}

export default Battery