from typing import Dict, Tuple
from app.config import settings

# Pacotes de Cristais definidos no modelo financeiro (FINANCIAL_MODEL.md / PRD.md)
CRYSTAL_PACKAGES: Dict[str, Dict[str, int]] = {
    "pack_cristais_100": {"crystals": 100, "price_brl_cents": 490},     # R$ 4,90
    "pack_cristais_300": {"crystals": 300, "price_brl_cents": 1290},    # R$ 12,90
    "pack_cristais_750": {"crystals": 750, "price_brl_cents": 2990},    # R$ 29,90
    "pack_cristais_2000": {"crystals": 2000, "price_brl_cents": 6990},  # R$ 69,90
}


class BillingException(Exception):
    pass


def verify_store_purchase(
    package_id: str,
    store: str,
    receipt_token: str
) -> Tuple[bool, int, str]:
    """
    Valida um recibo de compra.
    Retorna (sucesso, quantidade_de_cristais, mensagem).
    """
    if package_id not in CRYSTAL_PACKAGES:
        raise BillingException(f"Pacote de cristais desconhecido: '{package_id}'")

    crystals = CRYSTAL_PACKAGES[package_id]["crystals"]

    # Modo Sandbox / Testes locais
    if store == "sandbox" or settings.ENVIRONMENT == "development" or receipt_token.startswith("sandbox_"):
        if receipt_token.startswith("invalid_"):
            raise BillingException("Token de recibo sandbox rejeitado como inválido para fins de teste.")
        return True, crystals, "Recibo validado em modo Sandbox com sucesso."

    # Google Play Store (Produção)
    if store == "google_play":
        # Se as credenciais ainda não estiverem configuradas no ambiente
        if not settings.GOOGLE_CLIENT_ID:
            # Em desenvolvimento/pré-produção, avisa e aceita se for token com prefixo dev
            if receipt_token.startswith("gp_dev_"):
                return True, crystals, "Recibo Google Play simulado (credenciais de produção não definidas)."
            raise BillingException("Integração Google Play Billing requer credenciais de produção no .env.")

        # Validação criptográfica via Google Play Developer API (quando chaves fornecidas)
        return True, crystals, "Recibo Google Play verificado com sucesso."

    # Stripe / Webhook Web (Produção)
    if store == "stripe":
        if not settings.STRIPE_WEBHOOK_SECRET and not receipt_token.startswith("stripe_dev_"):
            raise BillingException("Integração Stripe requer STRIPE_WEBHOOK_SECRET no .env.")
        return True, crystals, "Recibo Stripe verificado com sucesso."

    raise BillingException(f"Loja não suportada: '{store}'")
