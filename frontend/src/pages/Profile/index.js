import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { FiPower, FiTrash2 } from "react-icons/fi";

import api from "../../sevices/api";
import logoImg from "../../assets/logo.svg";
import "./styles.css";

export default function Profile() {
    const history = useHistory();
    const [incidents, setIncidents] = useState([]);
    const ongId = localStorage.getItem("ongId");
    const ongName = localStorage.getItem("ongName");

    // Executar uma função em um determinado momento pré definido.
    // Se deixar o array vazio só irá executar uma vez a função
    useEffect(() => {
        api.get("profile", {
            headers: {
                ong: ongId
            }
        }).then(response => {
            setIncidents(response.data);
        });
    }, [ongId]); // array de dependências. Se a dependência muda, a função executa de novo

    async function handleDeleteIncident(id) {
        try {
            await api.delete(`incidents/${id}`, {
                headers: {
                    ong: ongId
                }
            });

            setIncidents(incidents.filter(incident => incident.id !== id))
        } catch(err) {
            alert('Erro ao tentar deletar caso, tente novamente.')
        }
    }

    function handleLogout() {
        localStorage.clear();
        history.push('/');
    }

    return (
        <div className="profile-container">
            <header>
                <img src={logoImg} alt="Be The Hero" />
                <span>Bem Vindo, {ongName}</span>
                <Link className="button" to="/incidents/new">
                    Cadastrar novo caso
                </Link>
                <button type="button" onClick={handleLogout}>
                    <FiPower size={18} color="e02041" />
                </button>
            </header>

            <h1>Casos cadastrados</h1>
            <ul>
                {incidents.map(incident => (
                    <li key={incident.id}>
                        <strong>CASO:</strong>
                        <p>{incident.title}</p>

                        <strong>DESCRIÇÃO:</strong>
                        <p>{incident.description}</p>

                        <strong>VALOR:</strong>
                        <p>
                            {Intl.NumberFormat("pt-BR", {
                                style: "currency",
                                currency: "BRL"
                            }).format(incident.value)}
                        </p>

                        <button type="button" onClick={() => handleDeleteIncident(incident.id)}>
                            <FiTrash2 size={20} color="#a8a8b3" />
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
