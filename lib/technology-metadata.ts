const ICONIFY_API = 'https://api.iconify.design';
const WIKIMEDIA_API = 'https://pt.wikipedia.org/api/rest_v1';

export interface TechnologyMetadata {
  iconUrl?: string;
  description?: string;
  source?: string;
}

interface IconifySearchResponse {
  icons?: string[];
}

interface WikipediaSummary {
  description?: string;
  extract?: string;
  type?: string;
  content_urls?: {
    desktop?: {
      page?: string;
    };
  };
}

function normalizeName(value: string): string {
  return value
    .trim()
    .replace(/\s+/g, ' ');
}

function getSearchTerms(name: string): string[] {
  const normalized = normalizeName(name);

  const aliases: Record<string, string[]> = {
    'Next.js': ['Next.js', 'Nextjs', 'nextdotjs'],
    'React DOM': ['React DOM', 'React'],
    'Tailwind CSS': ['Tailwind CSS', 'Tailwind'],
    Supabase: ['Supabase'],
    PostgreSQL: ['PostgreSQL', 'Postgres'],
    TypeScript: ['TypeScript'],
    Vitest: ['Vitest'],
    'GitHub Actions': ['GitHub Actions', 'GitHub'],
    'Node.js': ['Node.js', 'Nodejs', 'Node'],
    'Spring Boot': ['Spring Boot', 'Spring'],
    'JavaScript': ['JavaScript', 'JS'],
    'React Native': ['React Native', 'React'],
  };

  return aliases[normalized] ?? [
    normalized,
    normalized.replace(/[.@/_-]/g, ' '),
  ];
}

async function searchIcon(
  name: string
): Promise<string | undefined> {
  const terms = getSearchTerms(name);

  for (const term of terms) {
    try {
      const url = new URL(`${ICONIFY_API}/search`);

      url.searchParams.set('query', term);
      url.searchParams.set(
        'prefixes',
        'simple-icons,devicon,logos'
      );
      url.searchParams.set('limit', '5');

      const response = await fetch(url.toString(), {
        headers: {
          Accept: 'application/json',
        },
        next: {
          revalidate: 86400,
        },
      });

      if (!response.ok) {
        continue;
      }

      const data =
        (await response.json()) as IconifySearchResponse;

      const icon = data.icons?.find(
        (item) =>
          item.startsWith('simple-icons:') ||
          item.startsWith('devicon:') ||
          item.startsWith('logos:')
      );

      if (!icon) {
        continue;
      }

      const [prefix, iconName] = icon.split(':');

      if (!prefix || !iconName) {
        continue;
      }

      return `${ICONIFY_API}/${prefix}/${iconName}.svg?height=32&width=32`;
    } catch {
      continue;
    }
  }

  return undefined;
}

async function getWikipediaDescription(
  name: string
): Promise<string | undefined> {
  const terms = getSearchTerms(name);

  for (const term of terms) {
    try {
      const title = encodeURIComponent(
        term.replace(/\s+/g, '_')
      );

      const response = await fetch(
        `${WIKIMEDIA_API}/page/summary/${title}`,
        {
          headers: {
            Accept: 'application/json',
            'User-Agent':
              'Portfolio-Technical-Repository-Explorer/1.0',
          },
          next: {
            revalidate: 604800,
          },
        }
      );

      if (!response.ok) {
        continue;
      }

      const data =
        (await response.json()) as WikipediaSummary;

      if (
        data.type === 'disambiguation' ||
        !data.extract
      ) {
        continue;
      }

      const description =
        data.description?.trim() ||
        data.extract?.trim();

      if (!description) {
        continue;
      }

      if (data.description) {
        return data.description;
      }

      const firstSentence =
        data.extract
          .split(/(?<=[.!?])\s+/)[0]
          ?.trim();

      return firstSentence || data.extract;
    } catch {
      continue;
    }
  }

  return undefined;
}

export async function getTechnologyMetadata(
  name: string
): Promise<TechnologyMetadata> {
  const [iconUrl, description] =
    await Promise.all([
      searchIcon(name),
      getWikipediaDescription(name),
    ]);

  return {
    iconUrl,
    description,
    source: iconUrl
      ? 'Iconify'
      : undefined,
  };
}

export async function enrichTechnologyNames(
  names: string[]
): Promise<Record<string, TechnologyMetadata>> {
  const uniqueNames = [
    ...new Set(
      names
        .map(normalizeName)
        .filter(Boolean)
    ),
  ];

  const entries = await Promise.all(
    uniqueNames.map(async (name) => [
      name,
      await getTechnologyMetadata(name),
    ] as const)
  );

  return Object.fromEntries(entries);
}
