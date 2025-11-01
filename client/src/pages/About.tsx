import { Target, Eye, Users, Award } from "lucide-react";

const About = () => {
  const values = [
    {
      icon: Target,
      title: "Our Mission",
      description: "To provide cutting-edge technology solutions that empower educational institutions to focus on what matters most - education.",
    },
    {
      icon: Eye,
      title: "Our Vision",
      description: "To be the leading university management platform that transforms administrative processes worldwide.",
    },
    {
      icon: Users,
      title: "Our Team",
      description: "A dedicated group of educators and technologists working together to revolutionize education management.",
    },
    {
      icon: Award,
      title: "Our Values",
      description: "Innovation, integrity, and excellence in everything we do to serve the education community.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-primary text-white py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About UniManage</h1>
            <p className="text-xl text-white/90">
              We're dedicated to transforming university management through innovative technology
              and user-centered design.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="p-8 rounded-lg border border-border bg-card hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center mb-4">
                  <value.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-semibold mb-3">{value.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <h3 className="text-4xl font-bold text-primary mb-2">500+</h3>
              <p className="text-muted-foreground">Universities Using Our Platform</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold text-primary mb-2">1M+</h3>
              <p className="text-muted-foreground">Students Managed</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold text-primary mb-2">99.9%</h3>
              <p className="text-muted-foreground">Uptime Guarantee</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
