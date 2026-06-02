import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const DATA_PATH = path.join(process.cwd(), 'src', 'data', 'settings.json');

const DEFAULT_SETTINGS = {
  phone: '+996 555 000 000',
  email: 'info@taxi.kg',
  address: 'г. Бишкек, ул. Чуй 100',
  telegramToken: '',
  telegramChatId: '',
  smsApiKey: '',
  nightSurcharge: 20,
};

async function getSettings() {
  try {
    const data = await fs.readFile(DATA_PATH, 'utf-8');
    return JSON.parse(data);
  } catch {
    // If file doesn't exist, create it with defaults
    try {
      await fs.mkdir(path.dirname(DATA_PATH), { recursive: true });
      await fs.writeFile(DATA_PATH, JSON.stringify(DEFAULT_SETTINGS, null, 2), 'utf-8');
    } catch {}
    return DEFAULT_SETTINGS;
  }
}

export async function GET() {
  const settings = await getSettings();
  return NextResponse.json(settings);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const current = await getSettings();
    const updated = { ...current, ...body };

    await fs.mkdir(path.dirname(DATA_PATH), { recursive: true });
    await fs.writeFile(DATA_PATH, JSON.stringify(updated, null, 2), 'utf-8');

    return NextResponse.json({ success: true, settings: updated });
  } catch (error) {
    return NextResponse.json({ error: 'Не удалось сохранить настройки' }, { status: 500 });
  }
}
