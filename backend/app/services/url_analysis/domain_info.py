import whois
from datetime import datetime, timezone

def analyze_domain(url: str):
    try:
        domain = url.split("//")[-1].split("/")[0]
        w = whois.whois(domain)

        creation_date = w.creation_date

        if isinstance(creation_date, list):
            creation_date = creation_date[0]

        if creation_date is None:
            return {
                "domain_age_days": None,
                "new_domain": None
            }

        # FIX: Normalize both datetimes to UTC-aware before subtraction.
        # whois returns timezone-aware datetimes for many TLDs; datetime.now()
        # is naive — Python raises TypeError on naive/aware arithmetic.
        if creation_date.tzinfo is not None:
            now = datetime.now(timezone.utc)
        else:
            now = datetime.now()

        age_days = (now - creation_date).days

        return {
            "domain_age_days": age_days,
            "new_domain": age_days < 30
        }

    except Exception:
        return {
            "domain_age_days": None,
            "new_domain": None
        }