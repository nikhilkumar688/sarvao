import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GitBranch, Star, Share2, ExternalLink } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export default function Projects() {
  const { data: projects, isLoading } = useQuery({
    queryKey: ["/api/projects"],
  });

  if (isLoading) {
    return (
      <section id="projects" className="py-20 bg-yellow-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
            <p className="mt-4 text-gray-600">Loading projects...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="py-20 bg-yellow-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Open Source Projects</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our collection of open-source projects hosted on Gitea. Each project includes detailed impact metrics and community contributions.
          </p>
        </div>

        {/* Project Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-16">
          {projects && projects.map((project) => (
            <Card key={project.id} className="border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <GitBranch className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{project.name}</h3>
                      <div className="text-sm text-gray-600">{project.language}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-medium text-gray-700">{project.stars}</span>
                  </div>
                </div>

                <p className="text-gray-600 mb-4 leading-relaxed">{project.description}</p>

                <div className="grid grid-cols-3 gap-4 mb-6 text-center">
                  <div>
                    <div className="text-lg font-bold text-secondary">{project.commits}</div>
                    <div className="text-xs text-gray-600">Commits</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-primary">{project.contributors}</div>
                    <div className="text-xs text-gray-600">Contributors</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-accent">{project.openIssues}</div>
                    <div className="text-xs text-gray-600">Open Issues</div>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Button asChild className="flex-1 btn-primary">
                    <a href={project.giteaUrl} target="_blank" rel="noopener noreferrer">
                      <span>View on Gitea</span>
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: project.name,
                        text: project.description,
                        url: project.giteaUrl,
                      });
                    } else {
                      navigator.clipboard.writeText(project.giteaUrl);
                    }
                  }}>
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* External Projects */}
        <div className="text-center">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6">Explore More Projects</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 justify-center">
            <Button className="btn-primary w-full" asChild>
              <a href="https://github.com/nikhilkumar688/Tic-Tac-Toe" target="_blank" rel="noopener noreferrer">
                <span>View Tic-Tac-toe Projects</span>
                <ExternalLink className="w-4 h-4 ml-2" />
              </a>
            </Button>
            <Button className="btn-primary w-full" asChild>
              <a href="https://5b07215f-d969-4cdc-a6f0-8bab5b40818e-00-1p991jpfzzz0u.spock.replit.dev/auth" target="_blank" rel="noopener noreferrer">
                <span>View Aahar Dine Projects</span>
                <ExternalLink className="w-4 h-4 ml-2" />
              </a>
            </Button>
            <Button className="btn-primary w-full" asChild>
              <a href="https://nikhilkumar688.github.io/Tic-Tac-Toe" target="_blank" rel="noopener noreferrer">
                <span>View Tictac Game</span>
                <ExternalLink className="w-4 h-4 ml-2" />
              </a>
            </Button>
            <Button className="btn-primary w-full" asChild>
              <a href="https://nikhilkumar688.github.io/codearchives" target="_blank" rel="noopener noreferrer">
                <span>View Other Project</span>
                <ExternalLink className="w-4 h-4 ml-2" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
