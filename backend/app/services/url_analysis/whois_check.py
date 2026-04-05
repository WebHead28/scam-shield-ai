import whois
from datetime import datetime, timezone

def get_domain_age(url: str):
    try:
        domain_info = whois.whois(url)

        creation_date = domain_info.creation_date

        if isinstance(creation_date, list):
            creation_date = creation_date[0]

        if not creation_date:
            return {"domain_age_days": None}

        # FIX: Match timezone-awareness between creation_date and now().
        # whois returns tz-aware datetimes for many TLDs — using naive datetime.now()
        # raises TypeError: can't subtract offset-naive and offset-aware datetimes.
        if creation_date.tzinfo is not None:
            now = datetime.now(timezone.utc)
        else:
            now = datetime.now()

        age_days = (now - creation_date).days

        return {"domain_age_days": age_days}

    except Exception as e:
        return {
            "domain_age_days": None,
            "whois_error": str(e)
        }