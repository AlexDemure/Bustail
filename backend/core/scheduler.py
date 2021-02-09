from apscheduler.schedulers.asyncio import AsyncIOScheduler

from backend.apps.applications.tasks import completed_applications


def start():
    scheduler = AsyncIOScheduler(timezone='Europe/Moscow')
    scheduler.add_job(completed_applications, 'cron', hour=8)
    scheduler.start()
