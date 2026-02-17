import Link from "next/link";
import { ProjectCard } from "@/components/project-card";
import { getProjectCards, getProjectCategories } from "@/lib/sanity/queries";

const PAGE_SIZE = 12;

interface WorkPageProps {
  searchParams: Promise<{
    category?: string;
    year?: string;
    tool?: string;
    page?: string;
  }>;
}

function normalizeSearchParam(value?: string) {
  const normalized = value?.trim();
  if (!normalized) {
    return "";
  }
  return normalized;
}

function buildPageHref(
  page: number,
  activeFilters: {
    category: string;
    year: string;
    tool: string;
  }
) {
  const params = new URLSearchParams();

  if (activeFilters.category) params.set("category", activeFilters.category);
  if (activeFilters.year) params.set("year", activeFilters.year);
  if (activeFilters.tool) params.set("tool", activeFilters.tool);
  if (page > 1) params.set("page", String(page));

  const query = params.toString();
  return query ? `/work?${query}` : "/work";
}

export const revalidate = 300;

export default async function WorkPage({ searchParams }: WorkPageProps) {
  const [params, projects, categories] = await Promise.all([
    searchParams,
    getProjectCards(),
    getProjectCategories()
  ]);

  const selectedCategory = normalizeSearchParam(params.category);
  const selectedYear = normalizeSearchParam(params.year);
  const selectedTool = normalizeSearchParam(params.tool);

  const filteredProjects = projects.filter((project) => {
    const categoryMatch = selectedCategory ? project.categories.includes(selectedCategory) : true;
    const yearMatch = selectedYear ? String(project.year) === selectedYear : true;
    const toolMatch = selectedTool ? project.tools.includes(selectedTool) : true;
    return categoryMatch && yearMatch && toolMatch;
  });

  const years = Array.from(new Set(projects.map((project) => String(project.year)))).sort(
    (left, right) => Number(right) - Number(left)
  );

  const tools = Array.from(new Set(projects.flatMap((project) => project.tools))).sort((left, right) =>
    left.localeCompare(right)
  );

  const categoryOptionsFromProjects = Array.from(
    new Set(projects.flatMap((project) => project.categories))
  ).sort((left, right) => left.localeCompare(right));

  const categoryOptions = categories.length
    ? categories.map((category) => category.title)
    : categoryOptionsFromProjects;

  const pageParam = Number(params.page || "1");
  const requestedPage = Number.isFinite(pageParam) ? Math.max(1, Math.floor(pageParam)) : 1;

  const totalPages = Math.max(1, Math.ceil(filteredProjects.length / PAGE_SIZE));
  const currentPage = Math.min(requestedPage, totalPages);

  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const paginatedProjects = filteredProjects.slice(startIndex, startIndex + PAGE_SIZE);

  return (
    <main id="main-content" className="page-shell">
      <div className="container page-stack">
        <section className="section-frame">
          <div className="section-head">
            <p className="section-kicker">Archive</p>
            <h1>Work</h1>
            <p>Browse public case studies and filter by category, year, and toolchain.</p>
          </div>

          <form className="filter-form" method="get">
            <div className="filter-grid">
              <label>
                Category
                <select name="category" defaultValue={selectedCategory}>
                  <option value="">All</option>
                  {categoryOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Year
                <select name="year" defaultValue={selectedYear}>
                  <option value="">All</option>
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Tool
                <select name="tool" defaultValue={selectedTool}>
                  <option value="">All</option>
                  {tools.map((tool) => (
                    <option key={tool} value={tool}>
                      {tool}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="filter-actions">
              <button className="button-primary" type="submit">
                Apply Filters
              </button>
              <Link href="/work" className="button-secondary">
                Reset
              </Link>
            </div>
          </form>

          {paginatedProjects.length ? (
            <>
              <div className="work-grid">
                {paginatedProjects.map((project) => (
                  <ProjectCard key={project._id} project={project} />
                ))}
              </div>

              <div className="pagination" role="navigation" aria-label="Work pagination">
                <span className="pagination-status">
                  Page {currentPage} of {totalPages}
                </span>
                {currentPage > 1 ? (
                  <Link
                    href={buildPageHref(currentPage - 1, {
                      category: selectedCategory,
                      year: selectedYear,
                      tool: selectedTool
                    })}
                    className="button-secondary"
                  >
                    Previous
                  </Link>
                ) : null}
                {currentPage < totalPages ? (
                  <Link
                    href={buildPageHref(currentPage + 1, {
                      category: selectedCategory,
                      year: selectedYear,
                      tool: selectedTool
                    })}
                    className="button-secondary"
                  >
                    Next
                  </Link>
                ) : null}
              </div>
            </>
          ) : (
            <div className="empty-shell" role="status" aria-live="polite">
              <p>No work matches the current filters.</p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
