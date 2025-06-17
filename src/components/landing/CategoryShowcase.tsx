import { journalCategories } from '@/lib/data';
import CategoryCard from './CategoryCard';

const CategoryShowcase = () => {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-headline font-bold text-primary">
            Explore Your Worlds
          </h2>
          <p className="text-lg text-foreground/70 mt-4 max-w-2xl mx-auto font-body">
            Dive into diverse realms of thought, from adventurous tales to daily reflections.
            Find the perfect space for every aspect of your inner life.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {journalCategories.map((category, index) => (
            <CategoryCard key={category.id} category={category} animationDelay={`${index * 0.15}s`} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryShowcase;
