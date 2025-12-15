import os
from pathlib import Path

import pandas as pd
import matplotlib.pyplot as plt

# === Ruta base: carpeta del proyecto (donde está ESTE .py) ===
BASE_DIR = Path(__file__).resolve().parent
CHARTS_DIR = BASE_DIR / "assets" / "images" / "charts"

# Crear carpeta si no existe
CHARTS_DIR.mkdir(parents=True, exist_ok=True)
print(f"Guardando gráficas en: {CHARTS_DIR}")

# ---------- 1) CPL antes vs después ----------
data_cpl = {
    "mes": ["Ene", "Feb", "Mar", "Abr", "May", "Jun"],
    "cpl_antes":  [75, 72, 68, 62, 58, 55],
    "cpl_despues":[55, 52, 50, 48, 46, 45],
}
df_cpl = pd.DataFrame(data_cpl)

plt.figure(figsize=(6, 4))
plt.plot(df_cpl["mes"], df_cpl["cpl_antes"], marker="o", label="Antes")
plt.plot(df_cpl["mes"], df_cpl["cpl_despues"], marker="o", label="Después")
plt.title("Evolución del CPL por mes")
plt.xlabel("Mes")
plt.ylabel("CPL ($)")
plt.legend()
plt.tight_layout()

output1 = CHARTS_DIR / "cpl_evolucion.png"
plt.savefig(output1, dpi=120)
plt.close()
print(f"✔ Gráfica guardada: {output1.name}")

# ---------- 2) ROAS por campaña ----------
data_roas = {
    "campaña": ["Curso masaje", "Wellness spa", "Reel ofertas"],
    "roas":    [4.2, 2.1, 5.1],
}
df_roas = pd.DataFrame(data_roas)

plt.figure(figsize=(6, 4))
plt.bar(df_roas["campaña"], df_roas["roas"])
plt.title("ROAS por campaña")
plt.ylabel("ROAS (veces)")
plt.tight_layout()

output2 = CHARTS_DIR / "roas_campanas.png"
plt.savefig(output2, dpi=120)
plt.close()
print(f"✔ Gráfica guardada: {output2.name}")

# ---------- 3) CTR por dispositivo ----------
data_ctr = {
    "dispositivo": ["Móvil", "Escritorio"],
    "ctr":         [4.5, 2.3],
}
df_ctr = pd.DataFrame(data_ctr)

plt.figure(figsize=(5, 4))
plt.bar(df_ctr["dispositivo"], df_ctr["ctr"])
plt.title("CTR por dispositivo")
plt.ylabel("CTR (%)")
plt.tight_layout()

output3 = CHARTS_DIR / "ctr_dispositivos.png"
plt.savefig(output3, dpi=120)
plt.close()
print(f"✔ Gráfica guardada: {output3.name}")

print("\nListo: abre assets/images/charts/ y deberías ver las 3 imágenes .png")
